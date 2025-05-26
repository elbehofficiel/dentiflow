import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PageContainer from '../components/PageContainer.jsx';
import RoomTypeForm from '../components/RoomTypeForm.jsx';
import RoomTypeList from '../components/RoomTypeList.jsx';
import { fetchRoomTypes, createRoomType, deleteRoomType } from '../api.js';

function RoomTypesPage() {
  const { user } = useAuth();
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    async function load() {
      const types = await fetchRoomTypes();
      setRoomTypes(types);
    }
    load();
  }, []);

  const handleAdd = async (rt) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    const newRt = await createRoomType({ name: rt.name });
    setRoomTypes(prev => [...prev, newRt]);
  };

  const handleDelete = async (id) => {
    if (!['ADMIN', 'INFERMIERE'].includes(user.role)) return;
    await deleteRoomType(id);
    setRoomTypes(prev => prev.filter(rt => rt.id !== id));
  };

  return (
    <PageContainer title="Types de salles">
      {['ADMIN', 'INFERMIERE'].includes(user.role) && (
        <RoomTypeForm onAddRoomType={handleAdd} />
      )}
      <RoomTypeList roomTypes={roomTypes} onAddRoomType={handleAdd} onDeleteRoomType={handleDelete} />
    </PageContainer>
  );
}

export default RoomTypesPage;