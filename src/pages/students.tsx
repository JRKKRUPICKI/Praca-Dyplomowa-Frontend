import styled from "styled-components";
import { LINKS, Navigation } from "../components/navigation";
import { useAuth } from "../auth/Auth";
import { Topbar } from "../components/topbar";
import { StudentsProvider } from "./students/students.provider";

const Container = styled.div`
    display: grid;
    grid-template-columns: 270px auto;
`;

const Content = styled.div`
    margin: 20px;

    table{
        width: 100%;
        border-collapse: collapse;
        color: #7d8093;
        white-space: nowrap;

        thead tr{
            font-weight: bold;
        }

        tr{
            border: none;
        }

        tbody tr:hover{
            background: #333541;
            color: #c9c9c9;
            
            td:first-child{
                border-top-left-radius: 16px;
                border-bottom-left-radius: 16px;
            }

            td:last-child{
                border-top-right-radius: 16px;
                border-bottom-right-radius: 16px;
            }
        }

        td{
            padding: 8px;
            text-align: center;

            &:nth-child(1), &:nth-child(2){
                text-align: left;
                width: 50%
            }

            & > *:not(:first-child){
                margin-left: 8px;
            }
        }
    }

    & > *:nth-child(2){
        margin-top: 16px;
    }
`;

export default function Students() {

    const auth = useAuth();

    return (
        <Container>
            <Navigation activeLink={LINKS.STUDENTS} />
            <Content>
                <Topbar userName={auth?.user?.email ? auth?.user?.email : 'none'} />
                <StudentsProvider />
            </Content>
        </Container>
    )
}
