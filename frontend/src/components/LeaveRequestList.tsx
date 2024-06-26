import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRole } from '../contexts/RoleContext';

interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  employee: {
    id: number;
    fullName: string;
    subdivision: string;
    position: string;
    status: string;
    peoplePartner: string;
    outOfOfficeBalance: number;
    photo: string | null;
    role: {
      id: number;
      name: string;
    };
  };
}

const LeaveRequestList: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof LeaveRequest; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRequest, setNewRequest] = useState({ startDate: '', endDate: '', type: '' });
  const { role } = useRole();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get<LeaveRequest[]>('http://localhost:5000/leave-requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch leave requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleSort = (key: keyof LeaveRequest) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedRequests = React.useMemo(() => {
    let sortableRequests = [...requests];
    if (sortConfig !== null) {
      sortableRequests.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRequests;
  }, [requests, sortConfig]);

  const filteredRequests = sortedRequests.filter(request =>
    request.id.toString().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (id: number) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setShowDetails(true);
    }
  };

  const handleFormClose = () => {
    setShowDetails(false);
    setSelectedRequest(null);
  };

  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setNewRequest({ startDate: '', endDate: '', type: '' });
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/leave-requests', newRequest);
      alert('Leave request created successfully');
      setShowCreateForm(false);
      const response = await axios.get<LeaveRequest[]>('http://localhost:5000/leave-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to create leave request:', error);
    }
  };

  const handleUpdateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequest) {
      try {
        await axios.put(`http://localhost:5000/leave-requests/${selectedRequest.id}`, selectedRequest);
        alert('Leave request updated successfully');
        setShowDetails(false);
        const response = await axios.get<LeaveRequest[]>('http://localhost:5000/leave-requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to update leave request:', error);
      }
    }
  };

  const handleCancelRequest = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/leave-requests/${id}/cancel`);
      alert('Leave request canceled successfully');
      const response = await axios.get<LeaveRequest[]>('http://localhost:5000/leave-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to cancel leave request:', error);
    }
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <h2>Leave Requests</h2>
      {role === 'Employee' && (
        <button onClick={() => setShowCreateForm(true)}>Create New Leave Request</button>
      )}
      <input
        type="text"
        placeholder="Search by request number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>Request ID</th>
            <th onClick={() => handleSort('employee.fullName' as keyof LeaveRequest)}>Employee Name</th>
            <th onClick={() => handleSort('startDate')}>Start Date</th>
            <th onClick={() => handleSort('endDate')}>End Date</th>
            <th onClick={() => handleSort('type')}>Type</th>
            <th onClick={() => handleSort('status')}>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map(request => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.employee.fullName}</td>
              <td>{formatDate(request.startDate)}</td>
              <td>{formatDate(request.endDate)}</td>
              <td>{request.type}</td>
              <td>{request.status}</td>
              <td>
                <button onClick={() => handleViewDetails(request.id)}>View Details</button>
                {role === 'Employee' && (
                  <button onClick={() => handleCancelRequest(request.id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDetails && selectedRequest && (
        <div>
          <h3>Leave Request Details</h3>
          <form onSubmit={handleUpdateRequest}>
            <p>Request Number: {selectedRequest.id}</p>
            <p>Employee Name: {selectedRequest.employee.fullName}</p>
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={selectedRequest.startDate}
                onChange={(e) =>
                  setSelectedRequest({ ...selectedRequest, startDate: e.target.value })
                }
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={selectedRequest.endDate}
                onChange={(e) =>
                  setSelectedRequest({ ...selectedRequest, endDate: e.target.value })
                }
              />
            </label>
            <label>
              Type:
              <select
                name="type"
                value={selectedRequest.type}
                onChange={(e) =>
                  setSelectedRequest({ ...selectedRequest, type: e.target.value })
                }
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Vacation">Vacation</option>
                <option value="Personal">Personal</option>
              </select>
            </label>
            <p>Status: {selectedRequest.status}</p>
            <button type="submit">Update</button>
            <button type="button" onClick={handleFormClose}>Close</button>
          </form>
        </div>
      )}

      {showCreateForm && (
        <div>
          <h3>Create Leave Request</h3>
          <form onSubmit={handleCreateRequest}>
            <label>
              Start Date:
              <input
                type="date"
                value={newRequest.startDate}
                onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={newRequest.endDate}
                onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
              />
            </label>
            <label>
              Type:
              <select
                value={newRequest.type}
                onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
              >
                <option value="">Select type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Vacation">Vacation</option>
                <option value="Personal">Personal</option>
              </select>
            </label>
            <button type="submit">Submit</button>
            <button type="button" onClick={handleCreateFormClose}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestList;