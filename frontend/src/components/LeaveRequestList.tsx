import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface LeaveRequest {
  id: number;
  requestNumber: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
}

const LeaveRequestComponent: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof LeaveRequest; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRequest, setNewRequest] = useState({ startDate: '', endDate: '', type: '' });
  const role = localStorage.getItem('role');

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
    request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCreateRequest = async () => {
    try {
      await axios.post('http://localhost:5000/leave-requests', newRequest);
      alert('Leave request created successfully');
      setShowCreateForm(false);
      // Fetch the updated list of requests
      const response = await axios.get<LeaveRequest[]>('http://localhost:5000/leave-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to create leave request:', error);
    }
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
            <th onClick={() => handleSort('requestNumber')}>Request Number</th>
            <th onClick={() => handleSort('employeeName')}>Employee Name</th>
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
              <td>{request.requestNumber}</td>
              <td>{request.employeeName}</td>
              <td>{request.startDate}</td>
              <td>{request.endDate}</td>
              <td>{request.type}</td>
              <td>{request.status}</td>
              <td>
                {role !== 'Employee' && (
                  <button onClick={() => handleViewDetails(request.id)}>View Details</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDetails && selectedRequest && (
        <LeaveRequestDetails request={selectedRequest} onClose={handleFormClose} />
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

const LeaveRequestDetails: React.FC<{ request: LeaveRequest; onClose: () => void }> = ({ request, onClose }) => {
  return (
    <div>
      <h2>Leave Request Details</h2>
      <p>Request Number: {request.requestNumber}</p>
      <p>Employee Name: {request.employeeName}</p>
      <p>Start Date: {request.startDate}</p>
      <p>End Date: {request.endDate}</p>
      <p>Type: {request.type}</p>
      <p>Status: {request.status}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default LeaveRequestComponent;