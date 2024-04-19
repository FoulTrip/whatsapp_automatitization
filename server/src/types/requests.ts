export interface messageMassiveReq {
  onlySelect: onlySelectProps[];
  //   image: File | null;
  image: string | null;
  message: string;
  idSession: string;
  zipCode: string
}

interface onlySelectProps {
  number: string;
  name: string;
}
