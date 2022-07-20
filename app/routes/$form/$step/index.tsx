import { useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/cloudflare';
import { styled } from '~/stiches.config.js';

import Post from './test.mdx';

interface Question
{
    id: string,
    label: string,
    description: string,
}

interface IndexData
{
    questions: Question[],
}

export const loader: LoaderFunction = async () => {
    return json<IndexData>({
        questions: [
            { id: 'question1', label: 'Question 1', description: 'Description 1' },
            { id: 'question2', label: 'Question 1', description: 'Description 2' },
            { id: 'question3', label: 'Question 1', description: 'Description 3' },
        ],
    });
};

export default function Index()
{
    const { questions } = useLoaderData<IndexData>();

    return <>
        <Row>
            HEADER

            <RangeRoot>
                <div />

                <Header>Preferred</Header>
                <Header>Neutral</Header>
                <Header>Rather not</Header>
                <Header>Curious</Header>
            </RangeRoot>
        </Row>

        {questions.map(question => <Row>
            <header>
                <label style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{question.label}</label>

                <Post />
            </header>

            <Inputs id="" />
        </Row>)}
    </>;
}

function Inputs({ id }: { id: string })
{
    return <InputsRoot>
        <Range id={`${id}.receiving`} label="Receiving" />
        <Range id={`${id}.giving`} label="Giving" />
    </InputsRoot>;
}

function Range({ id, label }: { id: string, label: string })
{
    return <RangeRoot>
        <label>{label}</label>

        <input type="radio" name={`${id}.yes`} />
        <input type="radio" name={`${id}.neutral`} />
        <input type="radio" name={`${id}.no`} />
        <input type="radio" name={`${id}.maybe`} />
    </RangeRoot>;
}

const Row = styled('div', {
    display: 'grid',
    gridTemplateColumns: '20em auto',
    justifyContent: 'start',
});

const InputsRoot = styled('div', {
    display: 'grid',
    gap: '.5em',
    placeContent: 'start',
});

const RangeRoot = styled('div', {
    display: 'grid',
    gridTemplateColumns: '5em repeat(4, 2em)',
});

const Header = styled('span', {
    writingMode: 'tb',
});