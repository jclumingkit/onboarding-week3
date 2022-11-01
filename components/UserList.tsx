import { FC, useState } from "react";
import { Table, Modal, Button } from "@mantine/core";

import { Profile } from "../types/TProfile";
import PeerReviewForm from "./PeerReviewForm";

const UserList: FC<{ profileList: Profile[]; userId: string }> = ({
  profileList,
  userId,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentPeer, setCurrentPeer] = useState("");

  const rows = profileList.map((profile) => {
    return (
      <tr key={profile.id}>
        <td>{profile.username}</td>
        <td>
          <Button onClick={() => handleAddReview(profile.username)}>
            Add Review
          </Button>
        </td>
      </tr>
    );
  });

  const handleAddReview = (username: string) => {
    setCurrentPeer(username);
    setOpenModal(true);
  };

  return (
    <>
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th>Peer</th>
            <th>Add Review</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Modal
        title="Add Review"
        opened={openModal}
        onClose={() => setOpenModal(false)}
      >
        <PeerReviewForm userId={userId} username={currentPeer} />
      </Modal>
    </>
  );
};

export default UserList;
