import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext'
import routes from '../routes/routes'

export default function MainMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { authState } = React.useContext(AuthContext)
  const { authUser } = authState

  // Determina o nível do usuário autenticado
  let currentUserLevel

  if(!authUser) currentUserLevel = 0
  else if(authUser.is_admin) currentUserLevel = 2
  else currentUserLevel = 1

  /*
    Filtra as rotas que se tornarão itens de menu, excluindo:
    - rotas com omitFromMainMenu === true
    - rotas com userLevel > currentUserLevel
  */
  const menuRoutes = routes.filter(
    r => !(r?.omitFromMainMenu) && r.userLevel <= currentUserLevel
  )

  return (
    <div>
        <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            sx={{ mr: 2 }}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
           
        >
            
        </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {
          menuRoutes.map(r => (
            <MenuItem
              key={r.route}
              onClick={handleClose}
              component={Link}
              to={r.route}
              divider={r?.divider}
            >
              {r.description}
            </MenuItem>
          ))
        }
      </Menu>
    </div>
  );
}
