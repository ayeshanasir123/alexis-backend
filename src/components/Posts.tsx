import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { fetchPosts, addPost, deletePost, uploadFile } from '../services/api';

interface Post {
    id?: number;
    image: string;
    title: string;
    summary: string;
    description: string;
    startDate: string;
    endDate: string;
}

const Posts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [newPost, setNewPost] = useState<Post>({
        image: '',
        title: '',
        summary: '',
        description: '',
        startDate: '',
        endDate: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchPosts();
                const data = response.POSTS.map((post: any) => ({
                    id: post.ID,
                    image: post.IMAGE, // Assuming IMAGE is a base64 encoded string
                    title: post.TITLE,
                    summary: post.SUMMARY,
                    description: post.DESCRIPTION,
                    startDate: formatDateForInput(post.STARTDATE),
                    endDate: formatDateForInput(post.ENDDATE),
                }));
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchData();
    }, []);

    const formatDateForInput = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
    };

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    const handleShowAddPostModal = () => {
        setEditingPost(null);
        setNewPost({
            image: '',
            title: '',
            summary: '',
            description: '',
            startDate: '',
            endDate: '',
        });
        setImageFile(null); // Reset the file
        setShowModal(true);
    };

    const handleSavePost = async () => {
        try {
            let imageUrl = newPost.image;

            if (imageFile) {
                // Upload the image and get the URL
                imageUrl = await uploadFile(imageFile);
                console.log('Uploaded Image URL:', imageUrl);
            }

            const postData = { ...newPost, image: imageUrl };

            if (editingPost) {
                // Update existing post
                await addPost({ ...postData, id: editingPost.id });
            } else {
                // Add new post
                await addPost(postData);
            }

            // Refetch posts to update the list
            const response = await fetchPosts();
            const data = response.POSTS.map((post: any) => ({
                id: post.ID,
                image: post.IMAGE, // Assuming IMAGE is a base64 encoded string
                title: post.TITLE,
                summary: post.SUMMARY,
                description: post.DESCRIPTION,
                startDate: formatDateForInput(post.STARTDATE),
                endDate: formatDateForInput(post.ENDDATE),
            }));
            setPosts(data);

            setShowModal(false);
            setEditingPost(null);
            setNewPost({
                image: '',
                title: '',
                summary: '',
                description: '',
                startDate: '',
                endDate: '',
            });
            setImageFile(null); // Reset the file
        } catch (error) {
            console.error('Error handling post:', error);
        }
    };

    const handleEditPost = (post: Post) => {
        setEditingPost(post);
        setNewPost({
            id: post.id,
            image: post.image,
            title: post.title,
            summary: post.summary,
            description: post.description,
            startDate: formatDateForInput(post.startDate),
            endDate: formatDateForInput(post.endDate),
        });
        setImageFile(null); // Reset the file
        setShowModal(true);
    };

    const handleDeletePost = async (id: number) => {
        if (id) {
            if (window.confirm('Are you sure you want to delete this post?')) {
                try {
                    // Call the delete API
                    await deletePost(id);

                    // Update the post list after deletion
                    const response = await fetchPosts();
                    const data = response.POSTS.map((post: any) => ({
                        id: post.ID,
                        image: post.IMAGE, // Assuming IMAGE is a base64 encoded string
                        title: post.TITLE,
                        summary: post.SUMMARY,
                        description: post.DESCRIPTION,
                        startDate: formatDateForInput(post.STARTDATE),
                        endDate: formatDateForInput(post.ENDDATE),
                    }));
                    setPosts(data);
                } catch (error) {
                    console.error('Error deleting post:', error);
                }
            }
        } else {
            console.error('Invalid post ID');
        }
    };

    return (
        <div>
            <Button onClick={handleShowAddPostModal} className="mb-4">Add Post</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Summary</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.id}>
                            <td>
                                <img 
                                    src={post.image} 
                                    alt="Display" 
                                    style={{ maxWidth: '50%', height: '50px' }} 
                                />
                            </td>
                            <td>{post.title}</td>
                            <td>{post.summary}</td>
                            <td>{formatDate(post.startDate)}</td>
                            <td>{formatDate(post.endDate)}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEditPost(post)}><FaEdit /></Button>
                                <Button variant="danger" onClick={() => handleDeletePost(post.id || 0)}><FaTrash /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingPost ? 'Edit Post' : 'Add Post'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => {
                                    const input = e.target as HTMLInputElement; // Cast to HTMLInputElement
                                    if (input.files && input.files[0]) {
                                        setImageFile(input.files[0]);
                                        setNewPost({ ...newPost, image: URL.createObjectURL(input.files[0]) });
                                    }
                                }}
                            />
                             {newPost.image && (
                                <img
                                    src={newPost.image}
                                    alt="Preview"
                                    style={{ width: '100px', height: '100px', marginTop: '10px' }}
                                />
                            )}
                        </Form.Group>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSummary">
                            <Form.Label>Summary</Form.Label>
                            <Form.Control
                                type="text"
                                value={newPost.summary}
                                onChange={(e) => setNewPost({ ...newPost, summary: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newPost.description}
                                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStartDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newPost.startDate}
                                onChange={(e) => setNewPost({ ...newPost, startDate: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newPost.endDate}
                                onChange={(e) => setNewPost({ ...newPost, endDate: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSavePost}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Posts;
