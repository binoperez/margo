import React from 'react'

export const Header = (props) => {
        return(
            <div className="i20-margo-header">
                <div className="i20-margo-thumb">
                    <img src="./assets/images/margo_thumb.png"/>
                </div>
                <div className="i20-margo-title">
                    Margo
                </div>
                <button aria-label="close window" data-bind="click:close" onClick={ props.handleOpenChat.bind(this) }>
                    <icon-close className="svg-icon">
                        <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                            <title>Close</title>
                            <path d="M6 4.5L1.5 0 0 1.5 4.5 6 0 10.5 1.5 12 6 7.5l4.5 4.5 1.5-1.5L7.5 6 12 1.5 10.5 0 6 4.5z"></path>
                        </svg>
                    </icon-close>
                </button>
            </div>
        )
}