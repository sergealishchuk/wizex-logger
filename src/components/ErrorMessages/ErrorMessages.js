import { ErrorSharp } from '@mui/icons-material';
import React from 'react';

export default (props) => {
  const { errors = [], style = {} } = props;

  return (errors.length > 0) && (
    <div style={{
      fontSize: '0.75rem',
      marginTop: '6px',
      marginBottom: '16px',
      marginLeft: '16px',
      paddingLeft: 0,
      color: '#ff1744',
      ...style
    }}>
      {
        errors.length > 1 ? (
          <ul>
            {
              errors.map(item => (
                <li key={item.message}>{item.message}</li>
              ))
            }
          </ul>)
          : (
            <div>{errors[0].message}</div>
          )
      }
    </div>
  )

};