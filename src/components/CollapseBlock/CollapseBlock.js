import { _ } from '~/utils';
import { useState, useEffect } from 'react';
import Collapse from '@mui/material/Collapse';
import { ExpandIcon } from '~/components/icons';

export default function CollapseBlock(props) {
  const {
    children,
    title,
    icon,
    expand,
    expandId,
    expandAction = _.noop,
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
    }}>
      <div className="unselect block-header" style={{ cursor: 'default', backgroundColor: '#eee', display: 'flex', padding: '6px 16px', justifyContent: 'space-between' }} onClick={handleOpen}>
        <div style={{ display: 'flex' }}>{icon}<span style={{ marginLeft: '12px' }}>{title}</span></div>
        <ExpandIcon collapse={open} />
      </div>
      <Collapse in={open} timeout={100} style={{ width: '100%' }}>
        <div style={{ background: '#fff' }}>
          {children}
        </div>
      </Collapse >
    </div>
  );
};
