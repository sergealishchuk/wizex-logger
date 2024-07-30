import styled from '@emotion/styled';

export const TariffsStyled = styled('div')`
  background-color: #ebebeb;
  margin-top: 6px;
  margin-bottom: 16px;
  border: 1px #ebebeb solid;
  border-radius: 5px;
  padding: 12px;
  label {
    margin-left: 0;
    margin-right: 0;
  }
  .MuiFormControlLabel-label {
    font-size: 15px;
  }
  .actual {
    background-color: #cfcfcf;
    .Mui-disabled {
      font-weight: bold;
    }
  }
`;

export const TablePaymentsStyled = styled('div')`
    margin-top: 12px;
    body {
         color: #333;
       }
      .top { vertical-align: top; }
      .right { text-align: right; }
      .center { text-align: center; }
      .left { text-align: left; }
      .pr16 { padding-right: 16px; }
      .pl16 { padding-left: 16px; }
      tr {
        &:hover {
          background-color: #e0e0e0;
         }
      }
      td {
         padding: 1px 3px;
         font-size: 10px;
      }
     tbody {
       background-color: #ededed;
       font-size: 12px;
     }
    .head th {
      background-color: #d1d1d1;
      padding: 0 4px;
      font-size: 11px;
      white-space: nowrap;
    }
    .im {
      color: #333 !important;
    }
`;
