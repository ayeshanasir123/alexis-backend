import axiosInstance, { setAuthorizationHeader } from '../Utlis/axiosConfig';

interface Post {
    id?: number;
    image: string;
    title: string;
    summary: string;
    description: string;
    startDate: string;
    endDate: string;
}

export interface Offer {
    id?: number;
    image: string;
    link: string;
    startDate: string;
    endDate: string;
}

let refreshTimeout: NodeJS.Timeout | null = null;




// Define the handleLogout function
export const handleLogout = (navigate: (path: string) => void): void => {
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
    }
    localStorage.removeItem('refresh_token');
    setAuthorizationHeader(null);
    navigate('./');
};


//login
export const login = async (email: string, password: string): Promise<any> => {
    try {
        const response = await axiosInstance.post('/login', { email, password });

        // Log response for debugging
        console.log('API response:', response.data);

        if (response.data.SUCCESS) {
            return response.data; // Return data on successful login
        } else {
            throw new Error(response.data.MESSAGE || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        throw new Error('Invalid username and password');
    }
};

// Define a function to fetch posts

export const fetchoffers = async () => {
    try {
        const response = await axiosInstance.get('/offer');
        return response.data;
    } catch (error) {
        console.error('Error fetching offers:', error);
        throw error;
    }
};


export const addOffer = async (offer: any) => {
    try {
        const response = await axiosInstance.post('/offer/addoffer', offer);
        return response.data;
    } catch (error) {
        console.error('Error adding offer:', error);
        throw error;
    }
};

export const deleteOffer = async (id: number) => {
    try {
        const response = await axiosInstance.delete('/offer/delete', {
            data: { id } // Send id in the request payload
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting offer:', error);
        throw error;
    }
};

export const addPost = async (post: Post) => {
    try {
        const response = await axiosInstance.post('post/addpost', post);
        return response.data;
    } catch (error) {
        console.error('Error adding post:', error);
        throw error;
    }
};

// Fetch posts with images in binary format
export const fetchPosts = async () => {
    try {
        const response = await axiosInstance.get('/post');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};




export const deletePost = async (id: number) => {
    try {
        const response = await axiosInstance.delete('/post/delete', {
            data: { id } // Send id in the request payload
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};


export const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axiosInstance.post('/post/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const result = response.data;
        if (result.SUCCESS) {
            return result.FILEPATH; // Return the file path from the API response
        } else {
            throw new Error('File upload failed');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('File upload failed');
    }
};
export default axiosInstance;
