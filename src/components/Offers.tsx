import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { fetchoffers, addOffer, deleteOffer, uploadFile } from '../services/api'; // Adjust the import path based on your project structure

interface Offer {
    id?: number;
    image: string;  // This will hold the base64 string or URL after upload
    link: string;
    startDate: string;
    endDate: string;
}

const Offers: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
    const [newOffer, setNewOffer] = useState<Offer>({
        image: '',
        link: '',
        startDate: '',
        endDate: '',
    });

    const [imageFile, setImageFile] = useState<File | null>(null);

    // Fetch offers from the API on component mount
    useEffect(() => {
        const fetchOffersFromAPI = async () => {
            try {
                const response = await fetchoffers();
                console.log('Fetched offers:', response); // Debug logging

                // Transform the API response to match the expected structure
                const transformedOffers: Offer[] = response.OFFERS.map((offer: any) => ({
                    id: offer.ID,
                    image: offer.IMAGE,
                    link: offer.LINK,
                    startDate: new Date(offer.STARTDATE).toISOString().split('T')[0], // Convert to YYYY-MM-DD
                    endDate: new Date(offer.ENDDATE).toISOString().split('T')[0], // Convert to YYYY-MM-DD
                }));

                setOffers(transformedOffers);
            } catch (error) {
                console.error('Error fetching offers:', error);
                setError('Failed to fetch offers.');
            } finally {
                setLoading(false);
            }
        };
        fetchOffersFromAPI();
    }, []);

    const handleShowAddOfferModal = () => {
        setEditingOffer(null);
        setNewOffer({ image: '', link: '', startDate: '', endDate: '' });
        setImageFile(null); // Reset the file
        setShowModal(true);
    };

    const handleAddOffer = async () => {
        try {
            let imageUrl = '';

            if (imageFile) {
                // Upload the image and get the URL
                imageUrl = await uploadFile(imageFile);
                console.log('Uploaded Image URL:', imageUrl);
            } else {
                imageUrl = newOffer.image; // Use the existing image URL if no new image is uploaded
            }

            const offerData = { ...newOffer, image: imageUrl };

            if (editingOffer) {
                // Update existing offer
                await addOffer({ ...offerData, id: editingOffer.id });
            } else {
                // Add new offer
                await addOffer(offerData);
            }

            // Refetch offers to update the list
            const response = await fetchoffers();
            const transformedOffers: Offer[] = response.OFFERS.map((offer: any) => ({
                id: offer.ID,
                image: offer.IMAGE,
                link: offer.LINK,
                startDate: new Date(offer.STARTDATE).toISOString().split('T')[0],
                endDate: new Date(offer.ENDDATE).toISOString().split('T')[0],
            }));
            setOffers(transformedOffers);

            setShowModal(false);
            setEditingOffer(null);
            setNewOffer({
                image: '',
                link: '',
                startDate: '',
                endDate: '',
            });
            setImageFile(null); // Reset the file
        } catch (error) {
            console.error('Error handling offer:', error);
            setError('Failed to save offer.');
        }
    };

    const handleEditOffer = (offer: Offer) => {
        setEditingOffer(offer);
        setNewOffer({
            id: offer.id,
            image: offer.image,
            link: offer.link,
            startDate: offer.startDate,
            endDate: offer.endDate,
        });
        setImageFile(null); // Reset the file
        setShowModal(true);
    };

    const handleDeleteOffer = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            try {
                // Call the delete API
                await deleteOffer(id);
    
                // Update the offer list after deletion
                const response = await fetchoffers();
                const transformedOffers: Offer[] = response.OFFERS.map((offer: any) => ({
                    id: offer.ID,
                    image: offer.IMAGE,
                    link: offer.LINK,
                    startDate: new Date(offer.STARTDATE).toISOString().split('T')[0],
                    endDate: new Date(offer.ENDDATE).toISOString().split('T')[0],
                }));
    
                setOffers(transformedOffers);
            } catch (error) {
                console.error('Error deleting offer:', error);
                setError('Failed to delete offer.');
            }
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Optionally preview the image
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewOffer(prevOffer => ({
                    ...prevOffer,
                    image: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Button onClick={handleShowAddOfferModal} className="mb-4">Add Offer</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Link</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {offers.length > 0 ? (
                        offers.map(offer => (
                            <tr key={offer.id}>
                                <td>
                                    <img
                                        src={offer.image}
                                        alt="Offer"
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                </td>
                                <td>
                                    <a href={offer.link} target="_blank" rel="noopener noreferrer">
                                        {offer.link}
                                    </a>
                                </td>
                                <td>{offer.startDate}</td>
                                <td>{offer.endDate}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEditOffer(offer)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteOffer(offer.id || 0)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No offers available</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingOffer ? 'Edit Offer' : 'Add Offer'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {newOffer.image && (
                                <img
                                    src={newOffer.image}
                                    alt="Preview"
                                    style={{ width: '100px', height: '100px', marginTop: '10px' }}
                                />
                            )}
                        </Form.Group>
                        <Form.Group controlId="formLink">
                            <Form.Label>Link</Form.Label>
                            <Form.Control
                                type="text"
                                value={newOffer.link}
                                onChange={(e) => setNewOffer({ ...newOffer, link: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStartDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newOffer.startDate}
                                onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newOffer.endDate}
                                onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleAddOffer}>
                            Save Offer
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Offers;
