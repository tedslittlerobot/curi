/// <reference types="react" />
import React from 'react';
import PropTypes from 'prop-types';
import { CuriConfig, Response } from '@curi/core';
import { CuriContext } from './interface';
import { Action } from '@hickory/root';
export interface NavigatorProps {
    config: CuriConfig;
    render: (r: Response, action: string, c?: CuriConfig) => React.ReactElement<any>;
    response: Response;
    action: Action;
}
declare class Navigator extends React.Component<NavigatorProps> {
    static childContextTypes: {
        curi: PropTypes.Requireable<any>;
    };
    getChildContext(): CuriContext;
    render(): React.ReactElement<any>;
}
export default Navigator;
