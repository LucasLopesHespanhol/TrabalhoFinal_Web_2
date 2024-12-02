import Link from "next/link";

export default function TeacherAction(props) {
    return (
        <>
            <Link className="btn btn-outline-success btn-sm" href={`/admin/teacher/read/${ props.pid }`}>Visualizar</Link>
            <Link className="btn btn-outline-primary btn-sm" href={`/admin/teacher/update/${ props.pid }`}>Editar</Link>
            <Link className="btn btn-outline-danger btn-sm" href={`/admin/teacher/delete/${ props.pid }`}>Deletar</Link>
        </>
    )
}
