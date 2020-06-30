import React from 'react';
import { AppHeader, Footer, MovieSearch } from './utils';
import './App.css';

export default class App extends React.Component {
	render() {
		return (
			<div className="app">
				<header>
					<AppHeader />
				</header>
				<content>
					<MovieSearch />
				</content>
				<footer>
					<Footer />
				</footer>
			</div>
		);
	}
}
