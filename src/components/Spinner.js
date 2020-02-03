import React from "react";
import PropTypes from "prop-types";

import "./Spinner.css";

const Spinner = ({ size }) => (
    <svg
        width={size}
        height={size}
        className="spinner"
        viewBox="25 25 50 50"
    >
        <circle
            className="path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="5"
            strokeMiterlimit="10"
        />
    </svg>
);

Spinner.propTypes = {
    size: PropTypes.string.isRequired,
};

Spinner.defaultProps = {
    size: "30px",
};

export default Spinner;
