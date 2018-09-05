class UsersController < ApplicationController
  before_action :find_user, only: [:edit, :update, :show, :destroy]

  def edit; end

  def update
    @user.update(user_params)
    redirect_to user_edit_path(@user)
  end

  def create
      # Untested Code
    user = User.new(user_params)
    authorize user # I don't know where to put this TODO: Test this method
    if user.save
      redirect_to user_path(user)
    else
      raise
    end
  end

  def show; end

  def destroy
    @user.destroy
    redirect_to root_path
  end

  def setting
    @user = current_user
    require "google/cloud/translate"

    keyfile = ENV['TRANSLATION_CREDENTIALS']
    creds = Google::Cloud::Translate::Credentials.new(keyfile)

    translate = Google::Cloud::Translate.new(
      project_id: ENV["PROJECT_ID"],
      credentials: creds
    )

    @languages = translate.languages("en")
  end

  def update_setting
    current_user.update(user_params)
    puts ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    puts current_user.language
    current_user.save
    redirect_to setting_path
  end

  private

  def find_user
    @user = User.find(params[:id])
    #authorize @user
  end


  def user_params
    params.require(:user).permit(:email, :first_name, :last_name, :description, :photo, :language, :caption_font, :caption_font_size, :enable_transcript)
  end
end
