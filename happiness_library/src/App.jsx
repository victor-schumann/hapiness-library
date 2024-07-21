import { useEffect, useState } from 'react'
import personService from './services/persons'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      search: <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person, deletePerson }) => {
  return (
    <div>
      <button onClick={() => deletePerson(person.id)}>delete</button> {person.name} {person.number}
    </div>
  )
}

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person key={person.id} person={person} deletePerson={deletePerson} />
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService.getAll()
    .then(response => {
      setPersons(response.data)
    })
    .catch(error => {
      alert('Error detting persons');
      console.error('Error:', error);
    });
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault();
  
    const newPerson = {
      name: newName,
      number: newNumber
    };
  
    const existingPerson = persons.find(person => person.name === newName);
  
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)) {
        personService.update(existingPerson.id, newPerson)
          .then(response => {
            const updatedPersons = persons.map(person =>
              person.id !== existingPerson.id 
              ? person 
              : response.data
            );
            setPersons(updatedPersons);
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            alert('Error updating person');
            console.error('Error:', error);
          });
      }
    } else {
      personService.create(newPerson)
      .then(response => {
        const updatedPersons = persons.concat(response.data);
        setPersons(updatedPersons);
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        alert('Error updating person');
        console.error('Error:', error);
      });
    }
  };
  

  const deletePerson = (id) => {
    if (window.confirm(`Do you really want to delete this person?`)) {
      personService.unlink(id)
        .then(() => {
          const updatedPersons = persons.filter(p => p.id !== id);
          setPersons(updatedPersons);
        })
        .catch(error => {
          alert('Error deleting person');
          console.error('Error:', error);
        });
    }
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Happiness Library</h2>

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new entry</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App
