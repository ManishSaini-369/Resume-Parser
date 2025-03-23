import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button } from '@chakra-ui/react';
import { get_resumes } from '../api/endpoints';

function ResumeList() {
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        get_resumes()
            .then(response => {
                setResumes(response);
            })
            .catch(error => {
                console.error('Error fetching resumes:', error);
            });
    }, []);

    const handleDownload = (id) => {
        const token = localStorage.getItem('access_token'); // Assuming you store the token in localStorage
    
        axios({
            url: `http://localhost:8000/api/resumes/${id}/download/`,
            method: 'GET',
            withCredentials: true,
            responseType: 'blob',
            // headers: {
            //     Authorization: `Bearer ${token}`  // Add token here
            // },
            
        })
        .then((response) => {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `Resume_${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('Error downloading file:', error);
            alert('Failed to download resume. Please log in again.');
        });
    };
    

    return (
        <>
            <h1>Resume List</h1>
            {resumes.length > 0 ? (
                <TableContainer border='1px' borderColor='gray.200' borderRadius='md' p='4' w='100%'>
                    <Table size='sm'>
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Phone</Th>
                                <Th>Skills</Th>
                                {/* <Th>Download</Th> */}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {resumes.map(resume => (
                                <Tr key={resume.id}>
                                    <Td>{resume.name}</Td>
                                    <Td>{resume.email}</Td>
                                    <Td>{resume.phone}</Td>
                                    {/* <Td>{resume.skills}</Td> */}
                                    <Td>{Array.isArray(resume.skills) ? resume.skills.join(', ') : resume.skills.replace(/(?<=[a-z])(?=[A-Z])/g, ', ')}</Td>

                                    <Td>
                                        {/* <Button 
                                            colorScheme="blue" 
                                            size="sm"
                                            onClick={() => handleDownload(resume.id)}
                                        >
                                            Download
                                        </Button> */}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            ) : (
                <p>No resumes found.</p>
            )}
        </>
    );
}

export default ResumeList;
