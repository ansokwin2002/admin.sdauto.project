import { Heading } from "@radix-ui/themes";

interface CardHeadingProps {
    title: string;
    mb?: string;
}

export default function CardHeading({ title, mb="5" }: CardHeadingProps) {
    return (
        <Heading as="h3" size="2" mb={mb} className="!tracking-wider uppercase">{title}</Heading>
    )
}