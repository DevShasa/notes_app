import { useNote } from './NoteLayout'
import { Badge, Button, Col, Row, Stack } from 'react-bootstrap'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Link, useNavigate } from 'react-router-dom'

type Props = {
    onDelete: (id:string) => void
}

const ShowNote = (props: Props) => {

    const { onDelete } = props
    const note = useNote()
    const navigate = useNavigate()

    const clickDelete = (id:string)=>{
        onDelete(id)
        navigate("/")
    }

    return (
        <>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>{note.title}</h1>
                    {note.tags.length > 0 &&(
                        <Stack gap={1} direction="horizontal" className="flex-wrap">
                            {note.tags.map(tag=>(
                                <Badge className="text-truncate" key={tag.id}>
                                    {tag.label}
                                </Badge>
                            ))}
                        </Stack>
                    )}
                </Col>
                <Col xs="auto">
                    <Stack gap={2} direction='horizontal'>
                        <Link to={`/${note.id}/edit`}>
                            <Button variant="primary">Edit</Button>
                        </Link>
                        <Button onClick={()=>clickDelete(note.id)} variant="outline-danger">Delete</Button>
                        <Link to={`/`}>
                            <Button variant="outline-secondary">Back</Button>
                        </Link>
                    </Stack>
                </Col>
            </Row>
            <ReactMarkdown>{note.markdown}</ReactMarkdown>
        </>
    )
}

export default ShowNote