import React from 'react';

export default (props) => {
  const { errors = [] } = props;

  return (errors.length > 0) && (
    <div style={{ fontSize: '12px', marginBottom: '7px', marginTop: 0, paddingLeft: 0, color: '#cb0707' }}>
      <ul style={{margin: '3px 0 -16px 0'}}>
        {
          errors.map(item => (
            <li key={item.message}>{item.message}</li>
          ))
        }
      </ul>
    </div>
  )
};
