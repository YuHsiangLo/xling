@extends('layouts.wizard')

@section('title')
@lang('messages.DemoTitle')
@endsection

@section('content')


<form class="w-50 mx-auto" action="{{ route('demographic_questionnaires.store') }}" method="post">
   @csrf
   <input type="hidden" name="Operating system" value="{{ $useragent->os->family }}">
   <input type="hidden" name="Operating system version" value="{{ $useragent->os->toVersion() }}">
   <input type="hidden" name="Browser" value="{{ $useragent->ua->family }}">
   <input type="hidden" name="Browser version" value="{{ $useragent->ua->toVersion() }}">
    <div class="form-row">
        <div class="form-group col-md-6">
            <label for="age">@lang('questionnaire.Age')</label>
            <input type="number" class="form-control" id="age" name="user_age" min="0" required>
        </div>
        <div class="form-group col-md-6">
            <label for="gender">@lang('questionnaire.Gender')</label>
            <input type="text" class="form-control" id="gender" name="user_gender" required>
        </div>
    </div>
    <div class="form-group">
        <label for="pob">@lang('questionnaire.PoB')</label>
        <input type="text" class="form-control" id="pob" name="user_pob" placeholder=@lang('questionnaire.CityPlaceHolder') required>
    </div>
    <div class="form-group">
        <label for="cpor">@lang('questionnaire.Location')</label>
        <input type="text" class="form-control" id="cpor" name="user_cpor" placeholder=@lang('questionnaire.CityPlaceHolder') required>
    </div>
    <div class="form-group">
        <label>@lang('questionnaire.SpokenLanguages')</label>
        <input type="text" class="form-control m-0" name="user_l2">
        <input type="text" class="form-control m-0" name="user_l3">
        <input type="text" class="form-control" name="user_l4">
        <input type="text" class="form-control" name="user_l5">
        <input type="text" class="form-control" name="user_l6">
    </div>
   {{--
   <div class="form-row">
      <div class="form-group col-md-6">
         <label for='input_1_52_1' id='input_1_52_1_label'>Street Address</label>
         <input class='form-control' type='text' name='Address Line 1' id='input_1_52_1' value='' />
      </div>
      <div class="form-group col-md-6">
         <label for='input_1_52_2' id='input_1_52_2_label'>Address Line 2</label>
         <input class='form-control' type='text' name='Address Line 2' id='input_1_52_2' value='' />
      </div>
   </div>
   <div class="form-row">
      <div class="form-group col-md-6">
         <label for='input_1_52_3' id='input_1_52_3_label'>City</label>
         <input class='form-control' type='text' name='Address city' id='input_1_52_3' value='' />
      </div>
      <div class="form-group col-md-6">
         <label for='input_1_52_4' id='Address province'>State / Province / Region</label>
         <input class='form-control' type='text' name='Address province' id='input_1_52_4' value='' />
      </div>
   </div>
   <div class="form-row">
      <div class="form-group col-md-6">
         <label for='input_1_52_5' id='Address postal'>ZIP / Postal Code</label>
         <input class='form-control' type='text' name='Address postal' id='input_1_52_5' value='' />
      </div>
      <div class="form-group col-md-6">
         <label for='input_1_52_6' id='input_1_52_6_label'>Country</label>
            <select class='form-control' name='Address country' id='input_1_52_6'>
               <option value='' selected='selected'></option>
               @include('includes.any.questionnaire.country_list')
            </select>
      </div>
   </div>
   --}}
   <div class="text-center">
      <button type="submit" class="btn btn-primary">@lang('messages.Next')</button><br/><br/><br/>
   </div>
</form>
@endsection
