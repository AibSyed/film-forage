import React, { useState } from 'react';
import styled from 'styled-components';
import { MovieResult } from '.';

export default function MovieSearch() {
	const [query, setQuery] = useState('');
	const [movies, setMovies] = useState([]);

	const movieSearch = async (e) => {
		// prevent defualt action of posting data into query parameter
		e.preventDefault();
		console.log('submitting');
		//API request
		const url = `https://api.themoviedb.org/3/search/movie?api_key=e0d0d61a05032e0b098ce502912c6e6c&language=en-US&query=${query}&page=1&include_adult=false`;

		const res = await fetch(url);
		//data is converting res to json
		//data will await until res is finished before executing
		const data = await res.json();
		//results array contains movie object in tmdb API
		console.log(data.results);
		//setMovies is passed the results array and will determine which movies should be shown to user based on search query
		setMovies(data.results);
	};

	if (/Android/.test(navigator.appVersion)) {
		window.addEventListener('resize', function () {
			if (
				document.activeElement.tagName == 'INPUT' ||
				document.activeElement.tagName == 'TEXTAREA'
			) {
				document.activeElement.scrollIntoView();
			}
		});
	}

	return (
		<MovieFormWrapper>
			<form className="form" onSubmit={movieSearch}>
				<div className="box1">
					<input
						className="input"
						type="text"
						name="query"
						placeholder="i.e Lion King"
						value={query}
						//e is event | target is the input | value is the value of the input
						//onChange will update the value/state of setQuery
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
				<div className="box2">
					{query ? (
						<button className="button" type="submit">
							Search
						</button>
					) : (
						<button className="disabledButton" disabled={!query} type="submit">
							Enter Film Name
						</button>
					)}
				</div>
			</form>
			<MovieResult movies={movies} query={query} />
		</MovieFormWrapper>
	);
}

const MovieFormWrapper = styled.div`
	max-width: 90vh;
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	.form {
		display: flex;
		margin: 0 30px;
		justify-content: center;
		align-items: center;
		align-content: center;
		flex-direction: row;
	}
	.box1 {
		flex: 4;
		margin: 0;
		padding: 0;
	}
	.box2 {
		flex: 1;
		margin: 0;
		padding: 0;
	}

	.input {
		font-size: 1.6rem;
		padding: 0.5rem 2rem;
		line-height: 2.8rem;
		border-radius: 20px 0px 0px 20px;
		border: 1px solid #837573;
		background-color: #eef4e6;
		color: #837573;
		width: 100%;
	}

	.input:focus {
		outline: none;
	}

	.button {
		font-size: 1.6rem;
		padding: 0.5rem 2rem;
		line-height: 2.8rem;
		border-radius: 0px 20px 20px 0px;
		border: 1px solid #837573;
		background-color: #414460;
		cursor: pointer;
		transition: background-color 250ms;
		font-weight: bold;
		color: #eef4e6;
		width: 100%;
		max-width: 200px;
	}

	.button:hover {
		background-color: #edbcae;
		color: #414460;
	}

	.button:focus {
		outline: none;
	}

	.disabledButton {
		font-size: 1.1rem;
		padding: 0.5rem 2rem;
		line-height: 2.8rem;
		border-radius: 0px 20px 20px 0px;
		border: 1px solid #414460;
		background-color: #1b171a;
		font-weight: bold;
		color: #eef4e6;
		width: 100%;
		max-width: 200px;
	}

	.disabledButton:focus {
		outline: none;
	}

	@media (max-width: 812px) {
		.form {
			flex-direction: column;
			align-items: stretch;
			align-content: space-evenly;
			margin: 0 30px;
		}
		.input {
			border-radius: 20px;
			margin: 20px 0;
			max-width: 400px;
		}
		.button {
			border-radius: 20px;
			max-width: 400px;
		}
		.disabledButton {
			font-size: 1.6rem;
			border-radius: 20px;
			max-width: 400px;
		}
	}

	@media (max-width: 414px) {
		.form {
			flex-direction: column;
			align-items: stretch;
			align-content: space-evenly;
			margin: 0 30px;
		}
		.input {
			border-radius: 20px;
			margin: 20px 0;
			max-width: 300px;
			min-width: 220px;
		}
		.button {
			border-radius: 20px;
			max-width: 300px;
			min-width: 220px;
		}
		.disabledButton {
			font-size: 1.6rem;
			border-radius: 20px;
			max-width: 300px;
			min-width: 220px;
		}
	}
`;
