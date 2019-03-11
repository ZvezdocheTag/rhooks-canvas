import React, { Component, useContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types';
import * as Github from "../../github-client.js"

export function Query({ query, variables, children, normalize = data => data}) {
    // Get context from Github 
    // TODO: check this Context
    const client = useContext(Github.Context)
    const [state, setState] = useReducer(
        (state, newState) => ({...state, newState}),
        { loaded: false, fetching: false, data: null, error: null}
    )

    useEffect(
        () => {
            setState({ fetching: true })
            client.request(query, variables).then(
                res => setState({
                    data: normalize(res),
                    error: null,
                    loaded: true,
                    fetching: false,
                })
            ).catch(
                error => setState({
                    error,
                    data: null,
                    loaded: true,
                    fetching: false,
                })
            )
        },
        [query, variables]
    )

    return children(state)
}
