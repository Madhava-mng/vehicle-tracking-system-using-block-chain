import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AirportShuttle from '@mui/icons-material/AirportShuttle';


export default function KeyValue({keys, value, icon, bg}) {
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 660,
        height: 70,
        bgcolor: 'background.paper',
      }}
      style={{background: bg}}
    >
      <ListItem>
        <ListItemAvatar>
            {icon}
        </ListItemAvatar>
        <ListItemText primary={keys} secondary={value} />
      </ListItem>
    </List>
  );
}