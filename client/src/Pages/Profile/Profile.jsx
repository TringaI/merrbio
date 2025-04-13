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
    const [showOrderHistory, setShowOrderHistory] = useState(false);
    const { auth } = useAuth();
    const navigate = useNavigate();

    // Check if user has farmer role - checking specifically for roles.Farmer == 3001
    const isFarmer = userData?.roles?.Farmer === 3001;
    // Check if user is a superadmin
    const isSuperAdmin = userData?.roles?.SuperAdmin === 9999 || userData?.roles?.Admin === 9001;
    
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
                
                {/* Show Admin Panel button for SuperAdmins */}
                {isSuperAdmin && (
                    <div className="w-full flex justify-end mt-3">
                        <button 
                            className='bg-purple-700 px-4 py-3 rounded-md mt-2 text-white poppins'
                            onClick={() => navigate('/admin')}
                        >
                            Admin Panel
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
                    <div className="w-full flex justify-end mt-4">
                        <button 
                            className="dark-green-bg text-white px-3 py-2 rounded-md text-sm"
                            onClick={() => setShowOrderHistory(true)}
                        >
                            Historiku i Porosive
                        </button>
                    </div>
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

            {/* Order History Modal */}
            {showOrderHistory && (
                <OrderHistoryModal 
                    orders={orders}
                    onClose={() => setShowOrderHistory(false)}
                />
            )}
        </div>
    );
}

// Order History Modal Component
function OrderHistoryModal({ orders, onClose }) {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // Filter orders based on active tab
    const filteredOrders = () => {
        switch(activeTab) {
            case 'completed':
                return orders.filter(order => order.status === 'completed');
            case 'rejected':
                return orders.filter(order => order.status === 'rejected');
            case 'cancelled':
                return orders.filter(order => order.status === 'cancelled');
            default:
                return orders;
        }
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get background color for status badge
    const getStatusColor = (status) => {
        switch(status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get text for status
    const getStatusText = (status) => {
        switch(status) {
            case 'pending':
                return 'Në pritje';
            case 'accepted':
                return 'Pranuar';
            case 'completed':
                return 'Kompletuar';
            case 'rejected':
                return 'Refuzuar';
            case 'cancelled':
                return 'Anuluar';
            default:
                return status;
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg w-[90%] max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="moret text-2xl">Historiku i Porosive</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Tabs */}
                <div className="flex border-b px-4">
                    <button 
                        className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-green-500 font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        Të gjitha
                    </button>
                    <button 
                        className={`px-4 py-2 ${activeTab === 'completed' ? 'border-b-2 border-green-500 font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Të kompletuara
                    </button>
                    <button 
                        className={`px-4 py-2 ${activeTab === 'rejected' ? 'border-b-2 border-green-500 font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('rejected')}
                    >
                        Të refuzuara
                    </button>
                    <button 
                        className={`px-4 py-2 ${activeTab === 'cancelled' ? 'border-b-2 border-green-500 font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('cancelled')}
                    >
                        Të anuluara
                    </button>
                </div>
                
                {/* Content area - split view */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Orders list */}
                    <div className="w-1/3 border-r overflow-y-auto p-4">
                        {filteredOrders().length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Nuk ka porosi në këtë kategori</p>
                        ) : (
                            filteredOrders().map(order => (
                                <div 
                                    key={order._id} 
                                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedOrder?._id === order._id ? 'bg-gray-100' : ''}`}
                                    onClick={() => handleOrderClick(order)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">{order.productId?.name || 'Produkt'}</h3>
                                            <p className="text-sm text-gray-500">{formatDate(order.createdAt || new Date())}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-1">
                                        Sasia: {order.quantity} {order.productId?.unit || ''}
                                    </p>
                                    <p className="text-sm font-medium mt-1">
                                        ${order.totalPrice?.toFixed(2) || '0.00'}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* Order details */}
                    <div className="w-2/3 overflow-y-auto p-6">
                        {selectedOrder ? (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-semibold">Detajet e Porosisë</h2>
                                    <span className={`px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                        {getStatusText(selectedOrder.status)}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h3 className="text-gray-500 mb-2">Informacioni i Produktit</h3>
                                        <div className="bg-gray-50 p-4 rounded">
                                            <div className="flex items-center mb-4">
                                                <img 
                                                    src={`/images/product-images/${selectedOrder.productId?.images?.[0] || 'product-1.png'}`} 
                                                    className="w-16 h-16 object-cover rounded mr-4" 
                                                    alt={selectedOrder.productId?.name || 'Produkt'} 
                                                />
                                                <div>
                                                    <h4 className="font-medium">{selectedOrder.productId?.name || 'Produkt'}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Fermer: {selectedOrder.farmerId?.farmName || 'Fermer'}
                                                    </p>
                                                </div>
                                            </div>
                                            <p>Sasia: {selectedOrder.quantity} {selectedOrder.productId?.unit || ''}</p>
                                            <p>Çmimi për njësi: ${selectedOrder.productId?.price?.toFixed(2) || '0.00'}</p>
                                            <p className="font-medium mt-2">Totali: ${selectedOrder.totalPrice?.toFixed(2) || '0.00'}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-gray-500 mb-2">Informacioni i Dorëzimit</h3>
                                        <div className="bg-gray-50 p-4 rounded">
                                            <p><span className="font-medium">Adresa:</span> {selectedOrder.deliveryAddress || 'N/A'}</p>
                                            <p><span className="font-medium">Telefoni:</span> {selectedOrder.contactPhone || 'N/A'}</p>
                                            <p className="mt-2"><span className="font-medium">Data e porosisë:</span> {formatDate(selectedOrder.createdAt || new Date())}</p>
                                            <p><span className="font-medium">Përditësuar më:</span> {formatDate(selectedOrder.updatedAt || new Date())}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedOrder.message && (
                                    <div className="mb-6">
                                        <h3 className="text-gray-500 mb-2">Mesazhi</h3>
                                        <div className="bg-gray-50 p-4 rounded">
                                            <p className="italic">{selectedOrder.message}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Status history for completed orders */}
                                {selectedOrder.status === 'completed' && (
                                    <div>
                                        <h3 className="text-gray-500 mb-2">Historiku i Statusit</h3>
                                        <div className="border-l-2 border-green-500 pl-4 py-2 ml-4">
                                            <div className="mb-6 relative">
                                                <div className="w-4 h-4 rounded-full bg-green-500 absolute -left-6 top-0"></div>
                                                <p className="poppins font-medium">Porosia u krijua</p>
                                                <p className="text-sm text-gray-500">{formatDate(selectedOrder.createdAt || new Date())}</p>
                                            </div>
                                            
                                            <div className="mb-6 relative">
                                                <div className="w-4 h-4 rounded-full bg-green-500 absolute -left-6 top-0"></div>
                                                <p className="poppins font-medium">Porosia u pranua</p>
                                                <p className="text-sm text-gray-500">{formatDate(new Date(new Date(selectedOrder.createdAt).getTime() + 24*60*60*1000))}</p>
                                            </div>
                                            
                                            <div className="mb-6 relative">
                                                <div className="w-4 h-4 rounded-full bg-green-500 absolute -left-6 top-0"></div>
                                                <p className="poppins font-medium">Porosia u nis</p>
                                                <p className="text-sm text-gray-500">{formatDate(new Date(new Date(selectedOrder.createdAt).getTime() + 2*24*60*60*1000))}</p>
                                            </div>
                                            
                                            <div className="relative">
                                                <div className="w-4 h-4 rounded-full bg-green-500 absolute -left-6 top-0"></div>
                                                <p className="poppins font-medium">Porosia u dorëzua</p>
                                                <p className="text-sm text-gray-500">{formatDate(new Date(new Date(selectedOrder.updatedAt).getTime() - 12*60*60*1000))}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Rejection reason */}
                                {selectedOrder.status === 'rejected' && selectedOrder.message && (
                                    <div>
                                        <h3 className="text-gray-500 mb-2">Arsyeja e Refuzimit</h3>
                                        <div className="bg-red-50 p-4 rounded border-l-4 border-red-400">
                                            <p>{selectedOrder.message || 'Nuk është dhënë asnjë arsye.'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p>Zgjidhni një porosi për të parë detajet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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