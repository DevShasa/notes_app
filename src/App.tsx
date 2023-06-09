
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import NewNote from "./NewNote"
import { useMemo } from "react"
import { useLocalStorage } from "./useLocalStorage"
import {v4 as uuidV4} from "uuid"
import NoteList from "./NoteList"
import { NoteLayout } from "./NoteLayout"
import ShowNote from "./ShowNote"
import EditNote from "./EditNote"

export type Note = {
  id:string
 // & NoteData
  title:string
  markdown: string
  tags: Tag[]
}

export type NoteData = {
  title:string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id:string
  label:string
}


export type RawNote = {
  id:string,
} & RawNoteData

export type RawNoteData = {
  // Storage form of notes has notedata and only tagids not tag labels
  title:string,
  markdown:string,
  tagIds: string[] // storethe ids for each of the tags
}

function App() {
  
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(()=>{
    // here we are returning the full tags by fetching data from tags and combinind with notes
     return notes.map(note=>{
      return {...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
     })
  },[notes, tags])


  function onCreateNote({tags, ...data}:NoteData){
      // convert type noteData which does not have an id into type note which has an id and save in localstorage
      setNotes(prevNotes =>{
        // convert into rawnote which is esentualy a note but tags do not have label
        return [
          ...prevNotes, 
          {
            ...data,
            id: uuidV4(),
            tagIds: tags.map(tag => tag.id) // extract ids from the tag/ tags are stored without ids
          } 
        ]
      })
  }

  function onDeleteNote(id:string){
    setNotes(prevNotes => prevNotes.filter(note=> note.id !== id))
  }

  function addTag(tag:Tag){
    setTags(prev => [...prev, tag])

  }

  function onUpdateNote(id:string, {tags, ...data}:NoteData){
    setNotes(prevNotes =>{
      return prevNotes.map(note=>{
        if(note.id === id){
          return {...note, ...data, tagIds: tags.map(tag=> tag.id)}
        }else{
          return note
        }
      })
    })
  }

  function updateTag(id:string, label:string){
    setTags(prevTags=>{
      return prevTags.map(tag=>{
        if(tag.id === id){
          return {...tag, label}
        }else{
          return tag
        }
      })
    })
  }

  function deleteTag(id:string){
    setTags(prev=> prev.filter(tag => tag.id !== id))
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList availableTags={tags} notes={notesWithTags} onDeleteTag={deleteTag} onUpdateTag={updateTag}/>} />
        <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}/>} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags}/>}>
            <Route index element={<ShowNote onDelete={onDeleteNote}/>} />
            <Route path="edit" element={<EditNote submit={onUpdateNote} onAddTag={addTag} availableTags={tags}/>} />
        </Route>
        <Route path="*" element={<Navigate to="/"/>} />
      </Routes>
    </Container>

  )
}

export default App
