import './index.css'

const ProjectItem = prop => {
  const {eachProjectDetails} = prop
  const {name, imageUrl} = eachProjectDetails

  return (
    <li className="project-list-card">
      <img alt={name} className="project-image" src={imageUrl} />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectItem
