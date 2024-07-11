import CustomWidthTooltip from "../CustomTooltip";
import Link from "~/components/Link";
import RoundBadge from '~/components/RoundBadge';
import LockIcon from '@mui/icons-material/Lock';

import { IconTileStyled, Item } from "./iconTile.styled";

export default function IconTile(props) {
  const {
    href,
    icon,
    label,
    badge = 0,
    userLocked,
    userLockedControl,
    tooltipTitle = '',
  } = props;
  return (
    <IconTileStyled style={{ width: '140px', position: 'relative' }}>
      <Link href={href} disabled={userLockedControl && userLocked}>
        <Item style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            backgroundColor: '#d7e5ff3d',
          }}>
            {icon}
          </div>
          <div className="item-label">
            <div>
              {label}
            </div>
          </div>
        </Item>
        {
          userLockedControl && userLocked && (
            <CustomWidthTooltip title={tooltipTitle}>
              <LockIcon className="lock-icon" />
            </CustomWidthTooltip>
          )
        }
      </Link>
      {badge && badge > 0 ? (
        <div style={{ position: 'absolute', top: '2px', right: 0 }}>
          <RoundBadge value={badge} color="#a34848" />
        </div>
      ) : null}
    </IconTileStyled>
  );
};
