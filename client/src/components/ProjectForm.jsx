import { useState } from "react";

export const ProjectForm = ({onSubmit}) => {
    const[title, setTitle] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({title})
        setTitle('')
    }

    return(
        <div className="card">
            <div className="card-header">
                <h5>Новый проект</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Название проекта</label>
                        <input type="text" className="form-control" value={title} 
                            onChange={(e) => setTitle(e.target.value)} required>
                        </input>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Создать проект
                    </button>
                </form>
            </div>
        </div>
    )
}