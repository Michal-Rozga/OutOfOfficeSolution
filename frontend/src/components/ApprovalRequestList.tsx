import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ApprovalRequestList.module.scss';

interface Employee {
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
}

interface LeaveRequest {
  id: number;
  absenceReason: string;
  startDate: string;
  endDate: string;
  comment: string | null;
  status: string;
  employee: Employee;
}

interface ApprovalRequest {
  id: number;
  status: string;
  comment: string | null;
  approver: Employee;
  leaveRequest: LeaveRequest;
}

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

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
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
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

  const handleApprove = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/approval-requests/${id}/approve`);
      setRequests(requests.map(r => (r.id === id ? { ...r, status: 'Approved' } : r)));
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleReject = async (id: number, comment: string | null) => {
    try {
      await axios.put(`http://localhost:5000/approval-requests/${id}/reject`, { comment: comment || '' });
      setRequests(requests.map(r => (r.id === id ? { ...r, status: 'Rejected' } : r)));
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleFormClose = () => {
    setShowDetails(false);
    setSelectedRequest(null);
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.container}>
      <h2>Approval Requests</h2>
      <input
        type="text"
        placeholder="Search by request number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>Request Number</th>
            <th onClick={() => handleSort('leaveRequest.employee.fullName' as keyof ApprovalRequest)}>Employee Name</th>
            <th onClick={() => handleSort('leaveRequest.startDate' as keyof ApprovalRequest)}>Start Date</th>
            <th onClick={() => handleSort('leaveRequest.endDate' as keyof ApprovalRequest)}>End Date</th>
            <th onClick={() => handleSort('leaveRequest.absenceReason' as keyof ApprovalRequest)}>Reason</th>
            <th onClick={() => handleSort('status')}>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map(request => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.leaveRequest.employee.fullName}</td>
              <td>{formatDate(request.leaveRequest.startDate)}</td>
              <td>{formatDate(request.leaveRequest.endDate)}</td>
              <td>{request.leaveRequest.absenceReason}</td>
              <td>{request.status}</td>
              <td className={styles.actions}>
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
    <div className={styles.details}>
      <h2>Approval Request Details</h2>
      <p>Request Number: {request.id}</p>
      <p>Employee Name: {request.leaveRequest.employee.fullName}</p>
      <p>Start Date: {formatDate(request.leaveRequest.startDate)}</p>
      <p>End Date: {formatDate(request.leaveRequest.endDate)}</p>
      <p>Reason: {request.leaveRequest.absenceReason}</p>
      <p>Status: {request.status}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ApprovalRequestList;