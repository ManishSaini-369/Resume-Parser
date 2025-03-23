import React, { useState, useEffect } from 'react';
import { upload_file, get_parsed_data } from '../api/endpoints';
import { Button, Input, Flex, Spinner, Box, List, ListItem, Text } from "@chakra-ui/react";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        setLoading(true);
        try {
            const result = await upload_file(file);

            if (result) {
                alert('File uploaded successfully!');

                // Display saved data directly
                if (result.saved_data) {
                    console.log('Saved Data:', result.saved_data);

                    setParsedData([result.saved_data]);  // Display saved data directly
                } else {
                    await fetchParsedData();  // Fallback for older data
                }
            } else {
                alert('Failed to upload file.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchParsedData = async () => {
        try {
            const data = await get_parsed_data();
            setParsedData(data);
        } catch (error) {
            console.error('Data fetch error:', error);
            alert('Failed to fetch data.');
        }
    };

    useEffect(() => {
        fetchParsedData();
    }, []);

    return (
        <Box p="4" bg="gray.50" borderRadius="md" boxShadow="md">
            <Flex direction="column" gap={4}>
                <Input
                    type="file"
                    onChange={handleFileChange}
                    sx={{
                        "::file-selector-button": {
                            border: "none",
                            padding: "0.5rem 1rem",
                            backgroundColor: "teal.500",
                            color: "white",
                            borderRadius: "md",
                            cursor: "pointer",
                            _hover: {
                                backgroundColor: "teal.600"
                            }
                        }
                    }}
                />
                <Button colorScheme="teal" onClick={handleUpload} isLoading={loading}>
                    Upload
                </Button>
            </Flex>

            <Box mt="6">
                <Text fontSize="xl" fontWeight="bold" mb="2">Extracted Data:</Text>
                {loading ? (
                    <Flex align="center" justify="center" py="4">
                        <Spinner size="lg" color="teal.500" />
                    </Flex>
                ) : (
                    <List spacing={3}>
                        {parsedData.length > 0 ? (
                            parsedData.map((item, index) => (
                                <ListItem
                                    key={index}
                                    bg="white"
                                    p="4"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    borderRadius="md"
                                    boxShadow="sm"
                                >
                                    <Text><strong>Name:</strong> {item.name || "N/A"}</Text>
                                    <Text><strong>Phone:</strong> {item.phone || "N/A"}</Text>
                                    <Text><strong>Email:</strong> {item.email || "N/A"}</Text>
                                    <Text><strong>Skills:</strong> {item.skills ? item.skills.join(', ') : "N/A"}</Text>
                                </ListItem>
                            ))
                        ) : (
                            <Text>No data available.</Text>
                        )}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default FileUpload;
