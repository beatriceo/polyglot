class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:call]

  def call
  end

  def index
  end
end
