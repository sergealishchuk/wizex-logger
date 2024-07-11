import Link from "next/link";

export default function CustomLink(props) {
	const { children, disabled, ...rest } = props;
	return disabled
		? (<div style={{display: 'contents'}} className="custom-link" {...rest}>{children}</div>)
		: (<Link className="custom-link" {...props} />)
};
