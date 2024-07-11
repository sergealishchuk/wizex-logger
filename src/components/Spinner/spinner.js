import React from "react";
import cn from "classnames";

/**
 * Spinner component
 * @param  {object} props React props object
 */
export default (props) => {
  const { show } = props;
  return (
    <div className="spinner-container" style={{display: show ? 'block' : 'none'}}>
      <div
        aria-hidden="true"
        className={cn("spinner-wrapper", props.className)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="lds-microsoft"
          width="40px"
          height="40px"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <g transform="rotate(0)">
            <circle
              cx="81.73413361164941"
              cy="74.35045716034882"
              fill="#b2bada"
              r="2"
              transform="rotate(349.835 50.0001 50.0001)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="spline"
                values="0 50 50;360 50 50"
                times="0;1"
                keySplines="0.5 0 0.5 1"
                repeatCount="indefinite"
                dur="1.5s"
                begin="0s"
              />
            </circle>
            <circle
              cx="74.35045716034882"
              cy="81.73413361164941"
              fill="#a4add7"
              r="2"
              transform="rotate(355.286 50.0004 50.0003)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="spline"
                values="0 50 50;360 50 50"
                times="0;1"
                keySplines="0.5 0 0.5 1"
                repeatCount="indefinite"
                dur="1.5s"
                begin="-0.0625s"
              />
            </circle>
            <circle
              cx="65.3073372946036"
              cy="86.95518130045147"
              fill="#97a2d5"
              r="3"
              transform="rotate(358.574 50 50)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="spline"
                values="0 50 50;360 50 50"
                times="0;1"
                keySplines="0.5 0 0.5 1"
                repeatCount="indefinite"
                dur="1.5s"
                begin="-0.125s"
              />
            </circle>
            <circle
              cx="55.22104768880207"
              cy="89.65779445495241"
              fill="#8c9ad8"
              r="4"
              transform="rotate(359.935 50.0154 50.0154)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="spline"
                values="0 50 50;360 50 50"
                times="0;1"
                keySplines="0.5 0 0.5 1"
                repeatCount="indefinite"
                dur="1.5s"
                begin="-0.1875s"
              />
            </circle>
            <circle
              cx="44.77895231119793"
              cy="89.65779445495241"
              fill="#7f8fd7"
              r="5"
              transform="rotate(0.44778 50 50)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="spline"
                values="0 50 50;360 50 50"
                times="0;1"
                keySplines="0.5 0 0.5 1"
                repeatCount="indefinite"
                dur="1.5s"
                begin="-0.25s"
              />
            </circle>
            <circle
              cx="34.692662705396415"
              cy="86.95518130045147"
              fill="#7083d8"
              r="5"
              transform="rotate(2.64213 50 50)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="spline"
                values="0 50 50;360 50 50"
                times="0;1"
                keySplines="0.5 0 0.5 1"
                repeatCount="indefinite"
                dur="1.5s"
                begin="-0.3125s"
              />
            </circle>
            <circle
              cx="25.649542839651176"
              cy="81.73413361164941"
              fill="#6277d9"
              r="5"
              transform="rotate(6.86493 50 50)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="spline"
                values="0 50 50;360 50 50"
                times="0;1"
                keySplines="0.5 0 0.5 1"
                repeatCount="indefinite"
                dur="1.5s"
                begin="-0.375s"
              />
            </circle>
            <circle
              cx="18.2658663883506"
              cy="74.35045716034884"
              fill="#556cd6"
              r="5"
              transform="rotate(13.3632 50 50)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="spline"
                values="0 50 50;360 50 50"
                times="0;1"
                keySplines="0.5 0 0.5 1"
                repeatCount="indefinite"
                dur="1.5s"
                begin="-0.4375s"
              />
            </circle>
            <animateTransform
              attributeName="transform"
              type="rotate"
              calcMode="spline"
              values="0 50 50;0 50 50"
              times="0;1"
              keySplines="0.5 0 0.5 1"
              repeatCount="indefinite"
              dur="1.5s"
            />
          </g>
        </svg>
      </div>
    </div>
  )
};
