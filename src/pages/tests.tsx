import styled from "styled-components";
import { TestsProvider } from "../providers/tests.provider";
import { LINKS, Navigation } from "../components/navigation";
import { Topbar } from "../components/topbar";
import { useAuth } from "../auth/Auth";

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
            padding: 6px;
            text-align: center;

            &:nth-child(1){
                text-align: left;
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

export default function Tests() {

    const auth = useAuth();

    return (
        <Container>
            <Navigation activeLink={LINKS.TESTS} />
            <Content>
                <Topbar userName={auth?.user?.email ? auth?.user?.email : 'none'} />
                <TestsProvider />
            </Content>
        </Container>
    )
}
