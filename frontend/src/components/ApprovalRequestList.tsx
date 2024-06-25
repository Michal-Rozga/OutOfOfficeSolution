import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ApprovalRequest {
  id: number;
  requestNumber: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
}

const ApprovalRequestList: React.FC = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ApprovalRequest; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get<ApprovalRequest[]>('http://localhost:5000/approval-requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch approval requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleSort = (key: keyof ApprovalRequest) => {
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
    request.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    //request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (id: number) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setShowDetails(true);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/approval-requests/${id}/approve`);
      setRequests(requests.map(r => (r.id === id ? { ...r, status: 'approved' } : r)));
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleReject = async (id: number, comment: string | null) => {
    try {
      await axios.put(`http://localhost:5000/approval-requests/${id}/reject`, { comment: comment || '' });
      setRequests(requests.map(r => (r.id === id ? { ...r, status: 'rejected' } : r)));
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleFormClose = () => {
    setShowDetails(false);
    setSelectedRequest(null);
  };

  return (
    <div>
      <h2>Approval Requests</h2>
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
                <button onClick={() => handleViewDetails(request.id)}>View Details</button>
                <button onClick={() => handleApprove(request.id)}>Approve</button>
                <button onClick={() => handleReject(request.id, prompt("Enter rejection comment:"))}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDetails && selectedRequest && (
        <ApprovalRequestDetails request={selectedRequest} onClose={handleFormClose} />
      )}
    </div>
  );
};

const ApprovalRequestDetails: React.FC<{ request: ApprovalRequest; onClose: () => void }> = ({ request, onClose }) => {
  return (
    <div>
      <h2>Approval Request Details</h2>
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

export default ApprovalRequestList;