import { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';
import { Movies } from './components/Movies';
import { useMovies } from './hooks/UseMovies';
import debounce from 'just-debounce-it';

function useSearch() {
  const [search, updateSearch] = useState('');
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  console.log({ search });

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === '';
      return;
    }

    if (search === '') {
      setError('No se puede buscar una pelicula vacia');
      return;
    }
    if (search.match(/^\d+$/)) {
      setError('No se puede buscar una pelicula vacia');
      return;
    }
    setError(null);
  }, [search]);

  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);

  const { search, updateSearch, error } = useSearch();
  const { movies, getMovies, loading } = useMovies({ search, sort });

  const debouncerGetMovies = useCallback(
    debounce((search) => {
      getMovies({ search });
    }, 300),
    [getMovies]
  );

  const handleSort = () => {
    setSort(!sort);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getMovies(search);
    console.log({ search });
  };

  const handleChange = (e) => {
    const newSearch = e.target.value;
    updateSearch(newSearch);
    debouncerGetMovies({ newSearch });
  };

  return (
    <div className='page'>
      <h1>Buscador de peliculas</h1>

      <header>
        <form className='form' onSubmit={handleSubmit}>
          <input
            style={{
              border: '1px solid transparent',
              borderColor: error ? 'red' : 'transparent',
            }}
            onChange={handleChange}
            name='query'
            value={search}
            placeholder='Avengers, Start Wars, The Matrix...'
          />
          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
      <main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
    </div>
  );
}

export default App;
