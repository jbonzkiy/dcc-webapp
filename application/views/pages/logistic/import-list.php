<br/><br/>

<div class="ui container">
    <div class="scrolling content">
        <div class="ui form" id="import-form" style="padding: 15px 0px;">
            
            <div class="ui grid middle aligned">
                <div class="four column row">
                    <div class="left floated column">

                        <div class="fields" style="padding-bottom: 15px;">
                            <div class="field">
                                <label>Import File Name: <span id="importFileName" style="font-size: 15px; padding-left: 12px; font-style: italic;"></span></label>
                                <div id="jqxFileUpload"></div>
                            </div>
                            <button id="importNowBtn" class="ui green button">IMPORT NOW</button>
                        </div>

                    </div>
                    <div class="right floated right aligned column">
                        <button id="dlTemplateBtn" class="ui primary button">Download Template</button>
                    </div>
                </div>
            </div>

            <div class="ui divider"></div>
        
            <div class="ui container">
                <div id='jqxtabs'>
                    <ul style='margin-left: 20px;'>
                        <li>Disposable</li>
                        <li>Non-Disposable</li>
                    </ul>
                    <div style="padding: 5px">
                        <div id="disposableGrid"></div>
                    </div>
                    <div style="padding: 5px">
                        <div id="nonDisposableGrid"></div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<br/><br/>