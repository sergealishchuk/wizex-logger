import React from 'react';

export default (props) => {
  const { errors = [] } = props;

  return (errors.length > 0) && (
    <div style={{ marginBottom: '16px', marginTop: '-24px', paddingLeft: 0, color: '#cb0707' }}>
      <ul>
        {
          errors.map(item => (
            <li key={item.message}>{item.message}</li>
          ))
        }
      </ul>
    </div>
  )

};