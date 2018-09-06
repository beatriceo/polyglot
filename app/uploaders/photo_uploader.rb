class PhotoUploader < CarrierWave::Uploader::Base
  include Cloudinary::CarrierWave

  process convert: "jpg"
  process tags: ["profile_picture"]
end
