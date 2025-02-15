import { useEffect, useState } from 'react'
import resourceService from './services/resources'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      search: <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const ResourceForm = ({ newTitle, newDescription, newUrl, handleResourceChange, handleDescriptionChange, handleUrlChange, addResource }) => {
  return (
    <form onSubmit={addResource}>
      <div>
        name: <input value={newTitle} onChange={handleResourceChange} />
      </div>
      <div>
        description: <input value={newDescription} onChange={handleDescriptionChange} />
      </div>
      <div>
        url: <input value={newUrl} onChange={handleUrlChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Resource = ({ resource, deleteResource }) => {
  return (
    <div>
      <button onClick={() => deleteResource(resource.id)}>delete</button> 
      <a href={resource.url} target="_blank" rel="noopener noreferrer">
        {resource.name}
      </a>
      : {resource.description}
    </div>
  )
}


const Resources = ({ resources, deleteResource }) => {
  return (
    <div>
      {resources.map((resource) => (
        <Resource key={resource.id} resource={resource} deleteResource={deleteResource} />
      ))}
    </div>
  )
}

const App = () => {
  const [resources, setResources] = useState([])

  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    resourceService.getAll()
    .then(response => {
      setResources(response.data)
    })
    .catch(error => {
      alert('Error getting resources');
      console.error('Error:', error);
    });
  }, [])

  const handleResourceChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleDescriptionChange = (event) => {
    setNewDescription(event.target.value)
  }

    const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addResource = (event) => {
    event.preventDefault();
  
    const newResource = {
      name: newTitle,
      description: newDescription,
      url: newUrl
    };
  
    const existingResource = resources.find(resource => resource.name === newTitle || resource.url == newUrl);
  
    if (existingResource) {
      if (window.confirm(`${newTitle}'s URL or name is already added to the library. Replace the old data with the new data?`)) {
        resourceService.update(existingResource.id, newResource)
          .then(response => {
            const updatedResources = resources.map(resource =>
              resource.id !== existingResource.id 
              ? resource 
              : response.data
            );
            setResources(updatedResources);
            setNewTitle('');
            setNewDescription('');
            setNewUrl('');
          })
          .catch(error => {
            alert('Error updating resource');
            console.error('Error:', error);filteredResources
          });
      }
    } else {
      resourceService.create(newResource)
      .then(response => {
        const updatedResources = resources.concat(response.data);
        setResources(updatedResources);
        setNewTitle('');
        setNewDescription('');
        setNewUrl('');
      })
      .catch(error => {
        alert('Error updating resource');
        console.error('Error:', error);
      });
    }
  };
  

  const deleteResource = (id) => {
    if (window.confirm(`Do you really want to delete this resource?`)) {
      resourceService.unlink(id)
        .then(() => {
          const updatedResources = resources.filter(p => p.id !== id);
          setResources(updatedResources);
        })
        .catch(error => {
          alert('Error deleting resource');
          console.error('Error:', error);
        });
    }
  }

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Happiness Library</h2>

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new entry</h3>

      <ResourceForm
        newTitle={newTitle}
        newDescription={newDescription}
        newUrl={newUrl}
        handleResourceChange={handleResourceChange}
        handleDescriptionChange={handleDescriptionChange}
        handleUrlChange={handleUrlChange}
        addResource={addResource}
      />

      <h3>Numbers</h3>

      <Resources resources={filteredResources} deleteResource={deleteResource} />
    </div>
  )
}

export default App
