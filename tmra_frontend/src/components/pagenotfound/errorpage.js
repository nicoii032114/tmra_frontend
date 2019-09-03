import React, { Component } from 'react'

export default class PageError extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        
        };
    }



    render() {
        return (
            <div>
                <h1>Page Not Found</h1>
                <br/>
                <h3>The requested URL was not found on this server.</h3>
            </div>

                );
            }
}