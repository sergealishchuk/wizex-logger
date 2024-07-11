import { _ } from '~/utils';
import { StyledErrorPage } from '../StyledComponents';

export default function ErrorPage(props) {
  const {code, status, errors = []} = props;

  return (
    <StyledErrorPage>
      <div className="status">{status}</div>
      <div className="errorlist">
        {code && <span className="code">{code}::</span>}
        {
          _.map(errors, (error, index) => <span key={index}>{error.message}</span>)
        }
      </div>
    </StyledErrorPage>
  )
};
