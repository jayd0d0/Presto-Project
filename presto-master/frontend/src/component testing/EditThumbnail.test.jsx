import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadThumbnail from '../components/UploadThumbnailModal';

describe('Upload Thumbnail', () => {
  test('renders all necessary elements', () => {
    // Mock presentationId
    const presentationId = 'mockPresentationId';

    render(<UploadThumbnail token={token} store={store} setStore={setStore} />);
    const storeDummy = {
      presentations: [
        {
          presentationId: 0,
          title: 'Untitled',
          description: '',
          thumbnail: '/static/media/slide-default.c762d76cd0167d088983.jpg',
          defaultBackgroundColour: '#FFFFFF',
          slides: [
            {
              backgroundColour: '#FFFFFF',
              text: [],
              image: [],
              video: [],
              code: []
            }
          ]
        }
      ]
    };
    // Check if the "Edit Thumbnail" MenuItem is rendered
    const editThumbnailMenuItem = screen.getByText('Edit Thumbnail');
    expect(editThumbnailMenuItem).toBeInTheDocument();

    // Simulate clicking on the "Edit Thumbnail" MenuItem to open the dialog
    userEvent.click(editThumbnailMenuItem);

    // Check if the Dialog component is rendered after clicking on the MenuItem
    const editThumbnailDialog = screen.getByRole('dialog');
    expect(editThumbnailDialog).toBeInTheDocument();

    // Check if the "Upload New Image" Button is rendered within the dialog
    const uploadButton = screen.getByRole('button', {
      name: /upload new image/i
    });
    expect(uploadButton).toBeInTheDocument();

    // Check if the file input is rendered (using visually hidden input) within the dialog
    const fileInput = screen.getByLabelText(/upload new image/i);
    expect(fileInput).toBeInTheDocument();

    // Check if the "Submit" Button is rendered within the dialog
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });
});
