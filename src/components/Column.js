import React from "react";
import { number, string, bool, element } from "prop-types";
import cx from "classnames";

import "./Column.scss";

const Column = ({ slots, name, horizontal, children }) => (
    <React.Fragment>
        {!horizontal ?
            <div className="column">
                <div className="name">{name}</div>
                <div className="lessons">
                    <div>
                        {slots.map((_, i) => (
                            <div key={i} className={cx("box", { "box-light": _ % 2 === 0 })} />
                        ))}
                    </div>
                    {children}
                </div>
            </div>
            :
            <div className="row">
                <div className="name">{name}</div>
                <div className="lessons">
                    {children}
                </div>
            </div>
        }
    </React.Fragment>
);

Column.propTypes = {
    slots: number.isRequired,
    name: string.isRequired,
    horizontal: bool,
    children: element.isRequired,
};

Column.defaultProps = {
    horizontal: false,
};

export default Column;
