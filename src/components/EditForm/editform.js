import { _ } from '~/utils';
import { useState, useEffect } from 'react';
import Collapse from '@mui/material/Collapse';
import { ExpandIcon } from '~/components/icons';

export default function EditForm(props) {
  const {
    children,
    title,
    onCollapse,
    icon,
    expand,
    expandId,
    expandAction,
  } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  const handleOpen = () => {
    expandAction(expandId, expand, true);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: 0,
      border: '1px #e5e5e5 solid',
      borderRadius: '6px',
      marginBottom: '6px'
    }}>
      <div className="unselect" style={{ cursor: 'default', backgroundColor: '#eee', display: 'flex', padding: '6px 16px', justifyContent: 'space-between' }} onClick={handleOpen}>
        <div style={{ display: 'flex' }}>{icon}<span style={{ marginLeft: '12px' }}>{title}</span></div>
        <ExpandIcon collapse={open} />
      </div>
      <Collapse in={open} timeout={200} style={{ width: '100%', paddingLeft: '48px', marginBottom: open ? '3px' : 0 }}>
        <div style={{ background: '#fff', marginLeft: '-36px', marginRight: '12px', paddingTop: '24px', paddingBottom: 0 }}>
          {children}
        </div>
      </Collapse >
    </div>
  );
};
