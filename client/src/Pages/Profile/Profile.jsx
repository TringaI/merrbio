import React, { useState, useEffect } from 'react';
import './Profile.scss';
import FinishedProducts from '../../Components/FinishedProducts';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [farmerData, setFarmerData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const { auth } = useAuth();
    const navigate = useNavigate();

    // Check if user has farmer role - checking specifically for roles.Farmer == 3001
    const isFarmer = userData?.roles?.Farmer === 3001;
    
    console.log("Auth state:", auth);
    console.log("User data:", userData);
    console.log("Is farmer:", isFarmer);

    useEffect(() => {
        // Fetch user data
        const fetchUserData = async () => {
            try {
                console.log("Fetching user data...");
                const userResponse = await api.get('/users/me');
                console.log("User data:", userResponse.data);
                setUserData(userResponse.data);
                
                // Try to fetch farmer data regardless of role initially
                try {
                    console.log("Fetching farmer data...");
                    // First get all farmers
                    const farmersResponse = await api.get('/farmers');
                    console.log("All farmers:", farmersResponse.data);
                    
                    // Find the farmer profile that matches the current user ID
                    const currentFarmerData = farmersResponse.data.find(
                        farmer => farmer.userId._id === userResponse.data._id
                    );
                    
                    console.log("Current farmer data:", currentFarmerData);
                    if (currentFarmerData) {
                        setFarmerData(currentFarmerData);
                    }
                } catch (error) {
                    console.error('Error fetching farmer data:', error);
                }

                // Fetch purchase requests (orders)
                console.log("Fetching purchase requests...");
                const ordersResponse = await api.get('/requests/user');
                console.log("Orders data:", ordersResponse.data);
                setOrders(ordersResponse.data);
                
                // Count completed and pending orders
                const completed = ordersResponse.data.filter(order => 
                    order.status === 'completed'
                ).length;
                
                const pending = ordersResponse.data.filter(order => 
                    order.status === 'pending' || order.status === 'accepted'
                ).length;
                
                setCompletedOrders(completed);
                setPendingOrders(pending);
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleManageProducts = () => {
        navigate('/profili-fermerit');
    };

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    // Close edit modal and refresh user data
    const handleCloseEditModal = async (refreshData = false) => {
        setShowEditModal(false);
        
        if (refreshData) {
            setLoading(true);
            try {
                const userResponse = await api.get('/users/me');
                setUserData(userResponse.data);
                
                try {
                    const farmersResponse = await api.get('/farmers');
                    const currentFarmerData = farmersResponse.data.find(
                        farmer => farmer.userId._id === userResponse.data._id
                    );
                    if (currentFarmerData) {
                        setFarmerData(currentFarmerData);
                    }
                } catch (error) {
                    console.error('Error fetching farmer data:', error);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error refreshing user data:', error);
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <div className="w-full h-screen flex justify-center items-center">
            <img src="/images/icons/loading.png" className="w-[50px] animate-spin" alt="Loading..." />
        </div>;
    }

    // Check if there are any pending or accepted orders
    const hasActiveOrders = orders.filter(order => 
        order.status === 'pending' || order.status === 'accepted'
    ).length > 0;

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-[80vw] mt-40'>
                <h1 className='moret text-4xl'>Mirese erdhet ne profilin tuaj</h1>
                <hr />
                {/* Only show management button for farmers */}
                {isFarmer && (
                    <div className="w-full flex justify-end">
                        <button 
                            className='dark-green-bg px-4 py-3 rounded-md mt-5 text-white poppins'
                            onClick={handleManageProducts}
                        >
                            Menaxho Produktet
                        </button>
                    </div>
                )}
            </div>
            <div className='w-[80vw] grid grid-cols-12 mt-10 gap-5'>
                <div className="col-span-6 light-green-border p-10 rounded-md flex flex-col">
                    <h1 className='moret text-2xl'>Informacionet Personale</h1>
                    <hr />
                    <h1 className='poppins text-md mt-3'>Emri: <span className="font-medium">{userData?.firstName || ''}</span></h1>
                    <h1 className='poppins text-md'>Mbiemri: <span className="font-medium">{userData?.lastName || ''}</span></h1>
                    <h1 className='poppins text-md'>Email: <span className="font-medium">{userData?.email || ''}</span></h1>
                    <h1 className='poppins text-md'>Emri i perdoruesit: <span className="font-medium">{userData?.username || ''}</span></h1>
                    <h1 className='poppins text-md'>Lokacioni: <span className="font-medium">{userData?.location?.address || userData?.location?.coordinates?.join(', ') || 'N/A'}</span></h1>
                    
                    {/* Only show farm name for farmers */}
                    {isFarmer && (
                        <h1 className='poppins text-md'>Emri i fermes: <span className="font-medium">{farmerData?.farmName || 'Nuk është vendosur'}</span></h1>
                    )}
                    
                    <div className="w-full flex justify-end">
                        <img 
                            src="/images/icons/edit.png" 
                            className='w-[20px] cursor-pointer' 
                            alt="Edit"
                            onClick={handleEditProfile}
                        />
                    </div>
                </div>
                <div className="col-span-6 light-green-border p-10 rounded-md flex flex-col">
                    <h1 className='moret text-2xl'>Gjurmimi i porosive</h1>
                    <hr />
                    <h1 className='poppins text-md mt-3'>Numri i porosive te kompletuara: <span className="font-medium">{completedOrders}</span></h1>
                    <h1 className='poppins text-md'>Numri i porosive ne pritje: <span className="font-medium">{pendingOrders}</span></h1>
                </div>
                <div className="col-span-12 mt-19 flex flex-col light-green-border p-10 rounded-md">
                    <h1 className='moret text-2xl'>Lista e porosive</h1>
                    <hr />
                    <div className="flex w-full mt-10 flex-wrap gap-5">
                        {hasActiveOrders ? (
                            // Filter to show only pending and accepted orders
                            orders
                                .filter(order => order.status === 'pending' || order.status === 'accepted')
                                .map((order) => (
                                    <div key={order._id} className='w-[22%] mb-5'>
                                        <FinishedProducts 
                                            product={order.productId?.name || 'Produkt'} 
                                            image={order.productId?.images && order.productId.images.length > 0 
                                                ? order.productId.images[0] 
                                                : 'product-1.png'} 
                                            status={order.status}
                                            quantity={`${order.quantity} ${order.productId?.unit || ''}`}
                                            total={order.totalPrice.toFixed(2)}
                                            productId={order.productId?._id}
                                        />
                                    </div>
                                ))
                        ) : (
                            <p className="poppins text-md">Nuk keni porosi aktive në pritje.</p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Edit Profile Modal */}
            {showEditModal && (
                <EditProfileModal 
                    userData={userData}
                    farmerData={farmerData}
                    isFarmer={isFarmer}
                    onClose={handleCloseEditModal} 
                />
            )}
        </div>
    );
}

// Edit Profile Modal Component
function EditProfileModal({ userData, farmerData, isFarmer, onClose }) {
    const [formData, setFormData] = useState({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        phone: userData?.phone || '',
        location: {
            address: userData?.location?.address || '',
            coordinates: userData?.location?.coordinates || [0, 0]
        },
        farmName: farmerData?.farmName || '',
        description: farmerData?.description || 'Bio fermer',
        email: userData?.email || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'address') {
            setFormData({
                ...formData,
                location: {
                    ...formData.location,
                    address: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            console.log("Updating user profile with data:", {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                location: formData.location
            });
            
            // Update user profile
            await api.put('/users/me', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                location: formData.location
            });
            
            // If user is a farmer, update or create farmer profile
            if (isFarmer) {
                console.log("Updating/creating farmer profile with data:", {
                    farmName: formData.farmName,
                    description: formData.description,
                    location: formData.location,
                    phone: formData.phone,
                    email: formData.email
                });
                
                // Required data for farmer profile
                const farmerData = {
                    farmName: formData.farmName,
                    description: formData.description || 'Bio fermer',
                    location: {
                        type: 'Point',
                        coordinates: formData.location.coordinates || [0, 0],
                        address: formData.location.address || 'N/A'
                    },
                    phone: formData.phone || 'N/A',
                    email: formData.email
                };
                
                await api.post('/farmers', farmerData);
            }
            
            setSuccess('Profili u përditësua me sukses!');
            setTimeout(() => {
                onClose(true); // Close and refresh data
            }, 1500);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Ndodhi një gabim. Ju lutemi provoni përsëri.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
                <h2 className="moret text-2xl mb-4">Përditëso Profilin</h2>
                
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block poppins mb-1">Emri</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block poppins mb-1">Mbiemri</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block poppins mb-1">Telefoni</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block poppins mb-1">Adresa</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.location.address}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    
                    {/* Only show farm name field for farmers */}
                    {isFarmer && (
                        <>
                            <div className="mb-4">
                                <label className="block poppins mb-1">Emri i fermës</label>
                                <input
                                    type="text"
                                    name="farmName"
                                    value={formData.farmName}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block poppins mb-1">Përshkrimi i fermës</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    rows="3"
                                    required
                                ></textarea>
                            </div>
                        </>
                    )}
                    
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="px-4 py-2 border rounded"
                            disabled={loading}
                        >
                            Anulo
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 dark-green-bg text-white rounded"
                            disabled={loading}
                        >
                            {loading ? 'Duke përditësuar...' : 'Ruaj'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;