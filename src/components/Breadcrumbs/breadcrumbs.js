import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { _ } from '~/utils';
import { emphasize, styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Chip from '@mui/material/Chip';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from '~/components/Link';
import { useTranslation } from 'next-i18next';
import getBcList from './breadcrumbs.conf';
import { BreadcrumbsStyled } from './breadcrumbs.styled';

const StyledBreadcrumb = styled(Chip)((props) => {
	const { theme, href, ...rest } = props;

	const backgroundColor =
		theme.palette.mode === 'light'
			? theme.palette.grey[100]
			: theme.palette.grey[800];
	const isLeaf = _.isUndefined(href);

	return {
		backgroundColor,
		height: theme.spacing(3),
		color: theme.palette.text.primary,
		fontWeight: isLeaf ? theme.typography.fontWeightBold : theme.typography.fontWeightRegular,
		backgroundColor: isLeaf ? '#fff' : '#f5f5f5',
		cursor: isLeaf ? 'default' : 'pointer',
		'&:hover, &:focus': {
			backgroundColor: isLeaf ? '#fff' : emphasize(backgroundColor, 0.06),
		},
		'&:active': {
			boxShadow: theme.shadows[isLeaf ? 0 : 1],
			backgroundColor: isLeaf ? '#fff' : emphasize(backgroundColor, 0.12),
		},
		".MuiBreadcrumbs-separator": {
			margin: 0,
		},
		".MuiChip-label": {
			paddingLeft: isLeaf ? '6px' : '12px',
		}
	};
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591


export default function CustomizedBreadcrumbs(props) {
	const { route, bcProps, error } = props;
	const [bcmList, setBcmList] = useState({});
	const [path, setPath] = useState();
	const [currentLocale, setCurrentLocale] = useState('');
	const { t } = useTranslation(['sidebar']);
	const { locale } = useRouter();
	const refBreadcrumbs = useRef(null);

	useEffect(() => {
		setBcmList(getBcList(t, locale));
	}, []);

	useEffect(() => {
		const bcPath = bcmList[route];
		const path = _.isFunction(bcPath) ? bcPath(bcProps) : bcPath;
		setPath(path);
	}, [route, bcProps, bcmList]);

	useEffect(() => {
		if (bcProps && bcProps.shiftLeft) {
			const bcContainerLine = refBreadcrumbs.current;

			setTimeout(() => {
				if (bcContainerLine && bcContainerLine.childNodes && bcContainerLine.childNodes.length > 0) {
					bcContainerLine.childNodes[0].scrollTo(1e10, 0);
				}
			}, 0);
		}
	}, [path]);

	useEffect(() => {
		if (locale !== '') {
			setCurrentLocale(locale);
		}
	}, [locale]);

	useEffect(() => {
		const list = getBcList(t, currentLocale);
		setBcmList(list);
	}, [currentLocale]);

	if (error) {
		return null;
	}
	
	return (
		<div role="presentation">
			<BreadcrumbsStyled ref={refBreadcrumbs} className={locale} aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" style={{ margin: `-10px` }} />}>
				{
					_.isArray(path) && path.length > 0 && (
						_.map(path, (item) => (
							<StyledBreadcrumb
								key={item.label}
								component={item.href ? Link : 'div'}
								href={item.href}
								label={item.label}
								icon={item.icon}
							/>
						))
					)
				}
			</BreadcrumbsStyled>
		</div>
	);
};
