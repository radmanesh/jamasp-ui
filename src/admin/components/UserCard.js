import { Typography } from '@mui/material';
import { useEffect } from 'react';
export default function UserCard({user}) {

  useEffect(() => {
    console.log('UserCard mounted');
    return () => {
      console.log('UserCard unmounted');
    };
  }, []);

  return (
    <div>
      <Typography variant="h4">{user?.diplayName}</Typography>
      <button onClick={() => console.log("delete",user)}>Delete</button> 
    </div>
  );
} 