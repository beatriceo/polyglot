require 'test_helper'

class VideoSessionsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get video_sessions_create_url
    assert_response :success
  end

end
