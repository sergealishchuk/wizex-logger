import { useEffect, useState } from 'react';

export default function AccessDenied(props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1500);
  }, []);

	return (
		<div style={{
      visibility: show ? 'visible' : 'hidden',
      display: 'flex',
      opacity: show ? 1 : 0,
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 500ms',
    }}>
			{show ? <h1>Access Denied !</h1> : null}
		</div>
	);
};
